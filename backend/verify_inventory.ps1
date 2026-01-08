$baseUrl = "http://localhost:8080"

function Test-Reserve {
    param($sku, $qty)
    echo "Reserving $qty of $sku..."
    $body = @{ sku = $sku; quantity = $qty } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/inventory/reserve" -Method Post -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
    return $response
}

function Test-Confirm {
    param($id)
    echo "Confirming reservation $id..."
    $body = @{ reservationId = $id } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/checkout/confirm" -Method Post -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
    return $response
}

function Test-Cancel {
    param($id)
    echo "Cancelling reservation $id..."
    $body = @{ reservationId = $id } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/checkout/cancel" -Method Post -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
    return $response
}

function Get-Inventory {
    param($sku)
    Invoke-RestMethod -Uri "$baseUrl/inventory/$sku" -Method Get -ErrorAction SilentlyContinue
}

# 1. Clean state check
echo "Initial Inventory:"
Get-Inventory "IPHONE_15"

# 2. Reserve
$res = Test-Reserve "IPHONE_15" 5
if ($res.id) {
    echo "Reserved ID: $($res.id)"
} else {
    echo "Reservation Failed"
    exit
}

# 3. Check Inventory (Should have 5 reserved)
echo "Inventory after Reserve:"
Get-Inventory "IPHONE_15"

# 4. Confirm
Test-Confirm $res.id | Out-Null
echo "Confirmed."

# 5. Check Inventory (Total should decrease)
echo "Inventory after Confirm:"
Get-Inventory "IPHONE_15"

# 6. Reserve and Cancel
$res2 = Test-Reserve "IPHONE_15" 3
echo "Reserved ID: $($res2.id)"
echo "Inventory before Cancel:"
Get-Inventory "IPHONE_15"

Test-Cancel $res2.id | Out-Null
echo "Cancelled."
echo "Inventory after Cancel (Should be restored):"
Get-Inventory "IPHONE_15"

# 7. Oversell Test
echo "Testing Oversell (Reserve 1000)..."
try {
    Test-Reserve "IPHONE_15" 1000
} catch {
    echo "Oversell correctly failed or threw error."
}

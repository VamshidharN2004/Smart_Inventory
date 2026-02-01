package com.smartinventory.inventory_service.config;

import com.smartinventory.inventory_service.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import org.springframework.security.core.Authentication;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.toLowerCase().startsWith("bearer ")) {
            jwt = authorizationHeader.substring(7).trim();
            try {
                username = jwtUtils.extractUsername(jwt);
            } catch (Exception e) {
            }

            try {
                Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();
                if (username != null && (existingAuth == null ||
                        existingAuth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {

                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                    if (jwtUtils.validateToken(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        // DEBUG
                        System.out.println("JWT AUTH SUCCESS: " + username + " Roles: " + userDetails.getAuthorities());
                    } else {
                        System.out.println("JWT VALIDATION FAILED for: " + username);
                    }
                }
            } catch (Exception e) {
                System.out.println("JWT EXCEPTION: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}

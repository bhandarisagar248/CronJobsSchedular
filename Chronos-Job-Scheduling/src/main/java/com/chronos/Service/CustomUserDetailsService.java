package com.chronos.Service;


import com.chronos.DTO.AppConstant;
import com.chronos.Entity.Role;
import com.chronos.Entity.User;
import com.chronos.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = null;
//        user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
////        return new org.springframework.security.core.userdetails.User(
////                user.getEmail(),        // ✅ email used as username
////                user.getPassword(),     // password
////                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")) // roles (add later if needed)
////        );
//        return user;
//    }

@Transactional
@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // Fetch user by email
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // Map the user's roles to Spring Security's SimpleGrantedAuthority
    Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    for (Role role : user.getRoles()) {
        // Add the role name as "ROLE_" prefix
        authorities.add(new SimpleGrantedAuthority(role.getName()));
    }

    // Return Spring Security's User object with authorities
    return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            authorities
    );
}


}

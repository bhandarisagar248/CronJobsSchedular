package com.chronos.Service;

import com.chronos.DTO.AppConstant;
import com.chronos.Entity.Role;
import com.chronos.Repository.RoleRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepository;

    @PostConstruct
    public void init() {
        // Check if the roles already exist in the database
        if (roleRepository.findById(AppConstant.ADMIN_USER).isEmpty()) {
            roleRepository.save(new Role(AppConstant.ADMIN_USER, "ROLE_ADMIN"));
        }

        if (roleRepository.findById(AppConstant.NORMAL_USER).isEmpty()) {
            roleRepository.save(new Role(AppConstant.NORMAL_USER, "ROLE_USER"));
        }
    }
}

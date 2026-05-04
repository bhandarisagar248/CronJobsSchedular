package com.chronos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    public Long id;

    public String firstName;

    public String lastName;

    public String email;

    private Set<RoleDto> roles = new HashSet<>();
}

package com.chronos.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Role {

    public Role(Integer id, String name) {
        this.id=id;
        this.name=name;
    }

    @Id
    private Integer id;

    private String name;


}

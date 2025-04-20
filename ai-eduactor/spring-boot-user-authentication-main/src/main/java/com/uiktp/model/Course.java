package com.uiktp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;

    @ManyToMany(mappedBy = "courses")
    private List<Semester> semesters;

    @OneToMany(mappedBy = "course")
    @JsonManagedReference
    private List<Rating> ratings;

    @OneToMany(mappedBy = "course")
    @JsonManagedReference
    private List<Comment> comments;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_courses",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonManagedReference
    private List<User> likedBy;

    public Course(String title, String description){
        this.title = title;
        this.description = description;
    }
}

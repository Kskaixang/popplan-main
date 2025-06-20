package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Tag;

import java.util.Collection;
import java.util.List;


public interface TagRepository extends JpaRepository<Tag, Integer>{
	//SELECT * FROM tag WHERE tag_name = ?;
	Optional<Tag> findByTagName(String tagName);
	//SELECT * FROM tag WHERE tag_name IN ('A', 'B', 'C');
	List<Tag> findAllByTagNameIn(Collection<String> tagName);
}

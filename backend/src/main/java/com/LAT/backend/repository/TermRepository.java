package com.LAT.backend.repository;

import com.LAT.backend.model.Term;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TermRepository extends CrudRepository<Term, Long> {
    List<Term> findByReference(String reference);
}

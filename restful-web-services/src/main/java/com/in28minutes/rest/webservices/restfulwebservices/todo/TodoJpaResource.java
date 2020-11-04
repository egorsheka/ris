package com.in28minutes.rest.webservices.restfulwebservices.todo;

import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin(origins="http://localhost:4200")
@RestController
public class TodoJpaResource {


	@Autowired
	private TodoJpaRepository todoJpaRepository;


	@GetMapping("jpa/file/{file}/todo/{id}")
	public void makeFile(@PathVariable String file, @PathVariable long id) throws IOException {
		System.out.println(file + id);
		FileWriter writer = new FileWriter(file + ".txt");
		writer.write(todoJpaRepository.findById(id).get().toString());
		writer.flush();
		writer.close();
	}

	@GetMapping("/jpa/users/{username}/todos")
	public List<Apartment> getAllTodos(@PathVariable String username){
		return todoJpaRepository.findByUsername(username);
	}

	@GetMapping("/jpa/users/{username}/todos/{id}")
	public Apartment getTodos(@PathVariable String username, @PathVariable long id){
		if(id == -1.){
			return new Apartment();
		}
		return todoJpaRepository.findById(id).get();
		//return todoService.findById(id);
	}

	@GetMapping("/jpa/users/{username}/todo/{id}")
	public Apartment getTodo(@PathVariable String username, @PathVariable long id){
		if(id == -1.){
			return new Apartment();
		}
		Apartment apartment = todoJpaRepository.findById(id).get();
		apartment.setCount(apartment.getCount() + 1);
		System.out.println(apartment.getCount());
		todoJpaRepository.save(apartment);
		return apartment;
		//return todoService.findById(id);
	}

	// DELETE /users/{username}/todos/{id}
	@DeleteMapping("/jpa/users/{username}/todos/{id}")
	public ResponseEntity<Void> deleteTodo(
			@PathVariable String username, @PathVariable long id) {

		todoJpaRepository.deleteById(id);

		return ResponseEntity.noContent().build();
	}
	

	//Edit/Update a Todo
	//PUT /users/{user_name}/todos/{todo_id}
	@PutMapping("/jpa/users/{username}/todos/{id}")
	public ResponseEntity<Apartment> updateTodo(
			@PathVariable String username,
			@PathVariable long id, @RequestBody Apartment apartment){
		
		apartment.setUsername(username);
		
		Apartment apartmentUpdated = todoJpaRepository.save(apartment);
		
		return new ResponseEntity<Apartment>(apartment, HttpStatus.OK);
	}
	
	@PostMapping("/jpa/users/{username}/todos")
	public ResponseEntity<Void> createTodo(
			@PathVariable String username, @RequestBody Apartment apartment){
		
		apartment.setUsername(username);
		
		Apartment createdApartment = todoJpaRepository.save(apartment);
		
		//Location
		//Get current resource url
		///{id}
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}").buildAndExpand(createdApartment.getId()).toUri();
		
		return ResponseEntity.created(uri).build();
	}
		
}

package backend.WebFroPhto.service;

import backend.WebFroPhto.entity.Post;
import backend.WebFroPhto.entity.PhotoSpot;
import backend.WebFroPhto.repository.PostRepository;
import backend.WebFroPhto.repository.PhotoSpotRepository;
import backend.WebFroPhto.dto.post.PostDto;
import backend.WebFroPhto.dto.post.CreatePostRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PhotoSpotRepository photoSpotRepository;

    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PostDto> getPostById(Long id) {
        return postRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<PostDto> getPostsByPhotoSpot(Long photoSpotId) {
        return postRepository.findByPhotoSpotId(photoSpotId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PostDto createPost(CreatePostRequest request) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setImageUrl(request.getImageUrl());
        post.setTags(request.getTags());

        if (request.getPhotoSpotId() != null) {
            Optional<PhotoSpot> photoSpot = photoSpotRepository.findById(request.getPhotoSpotId());
            photoSpot.ifPresent(post::setPhotoSpot);
        }

        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }

    public Optional<PostDto> updatePost(Long id, CreatePostRequest request) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setImageUrl(request.getImageUrl());
            post.setTags(request.getTags());

            if (request.getPhotoSpotId() != null) {
                Optional<PhotoSpot> photoSpot = photoSpotRepository.findById(request.getPhotoSpotId());
                photoSpot.ifPresent(post::setPhotoSpot);
            }

            Post savedPost = postRepository.save(post);
            return convertToDto(savedPost);
        });
    }

    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthor(post.getAuthor());
        dto.setImageUrl(post.getImageUrl());
        dto.setLikesCount(post.getLikesCount());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setTags(post.getTags());
        
        if (post.getPhotoSpot() != null) {
            dto.setPhotoSpotId(post.getPhotoSpot().getId());
            dto.setPhotoSpotName(post.getPhotoSpot().getName());
        }
        
        return dto;
    }
} 
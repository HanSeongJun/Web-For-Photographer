package backend.WebFroPhto.service;

import backend.WebFroPhto.entity.Comment;
import backend.WebFroPhto.entity.Post;
import backend.WebFroPhto.repository.CommentRepository;
import backend.WebFroPhto.repository.PostRepository;
import backend.WebFroPhto.dto.comment.CommentDto;
import backend.WebFroPhto.dto.comment.CreateCommentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public List<CommentDto> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CommentDto> getCommentById(Long id) {
        return commentRepository.findById(id)
                .map(this::convertToDto);
    }

    public CommentDto createComment(CreateCommentRequest request) {
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthor(request.getAuthor());
        comment.setAuthorId(request.getAuthorId() != null ? request.getAuthorId() : 0L);
        comment.setLikesCount(0);
        comment.setCreatedAt(LocalDateTime.now());

        Optional<Post> post = postRepository.findById(request.getPostId());
        if (post.isPresent()) {
            comment.setPost(post.get());
            Comment savedComment = commentRepository.save(comment);
            return convertToDto(savedComment);
        } else {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
    }

    public Optional<CommentDto> updateComment(Long id, CreateCommentRequest request) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(request.getContent());
            comment.setUpdatedAt(LocalDateTime.now());
            Comment savedComment = commentRepository.save(comment);
            return convertToDto(savedComment);
        });
    }

    public boolean deleteComment(Long id, Long userId) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            // 댓글 작성자만 삭제할 수 있도록 권한 확인
            if (comment.getAuthorId() != null && comment.getAuthorId().equals(userId)) {
                commentRepository.deleteById(id);
                return true;
            } else {
                throw new RuntimeException("댓글을 삭제할 권한이 없습니다.");
            }
        }
        return false;
    }

    public boolean likeComment(Long id) {
        return commentRepository.findById(id).map(comment -> {
            comment.setLikesCount(comment.getLikesCount() + 1);
            commentRepository.save(comment);
            return true;
        }).orElse(false);
    }

    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthor(comment.getAuthor());
        dto.setAuthorId(comment.getAuthorId());
        dto.setLikesCount(comment.getLikesCount());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        
        if (comment.getPost() != null) {
            dto.setPostId(comment.getPost().getId());
        }
        
        return dto;
    }
} 
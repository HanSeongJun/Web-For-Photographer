package backend.WebFroPhto.controller;

import backend.WebFroPhto.dto.comment.CommentDto;
import backend.WebFroPhto.dto.comment.CreateCommentRequest;
import backend.WebFroPhto.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175"})
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDto>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentDto> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(@RequestBody CreateCommentRequest request) {
        CommentDto savedComment = commentService.createComment(request);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Object> deleteComment(@PathVariable Long commentId, @RequestParam(required = false) Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "사용자 ID가 필요합니다."));
            }
            
            boolean deleted = commentService.deleteComment(commentId, userId);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "댓글을 찾을 수 없습니다."));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentDto> likeComment(@PathVariable Long commentId) {
        boolean liked = commentService.likeComment(commentId);
        if (liked) {
            CommentDto comment = commentService.getCommentById(commentId).orElse(null);
            return ResponseEntity.ok(comment);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
} 
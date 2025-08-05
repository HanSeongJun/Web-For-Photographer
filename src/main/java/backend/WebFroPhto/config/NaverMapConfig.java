package backend.WebFroPhto.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NaverMapConfig {
    
    @Value("${naver.client.id}")
    private String clientId;
    
    @Value("${naver.client.secret}")
    private String clientSecret;
    
    public String getClientId() {
        return clientId;
    }
    
    public String getClientSecret() {
        return clientSecret;
    }
} 
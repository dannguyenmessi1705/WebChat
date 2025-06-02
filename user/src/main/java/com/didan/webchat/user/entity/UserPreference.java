package com.didan.webchat.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing user preferences
 */
@Entity
@Table(name = "user_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "theme_mode")
    @Enumerated(EnumType.STRING)
    private ThemeMode themeMode = ThemeMode.SYSTEM;

    @Column(name = "notification_enabled")
    private boolean notificationEnabled = true;

    @Column(name = "sound_enabled")
    private boolean soundEnabled = true;

    @Column(name = "language", length = 10)
    private String language = "en";

    @Column(name = "timezone", length = 50)
    private String timezone = "UTC";

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ThemeMode {
        LIGHT, DARK, SYSTEM
    }
}

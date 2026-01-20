package com.dipanjan.deltatrading.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_snapshots", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "week_start_date" })
})
public class WeeklySnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start_date", nullable = false)
    private LocalDateTime weekStartDate;

    @Column(name = "start_net_worth", nullable = false, precision = 19, scale = 2)
    private BigDecimal startNetWorth;

    public WeeklySnapshot() {
    }

    public WeeklySnapshot(User user, LocalDateTime weekStartDate, BigDecimal startNetWorth) {
        this.user = user;
        this.weekStartDate = weekStartDate;
        this.startNetWorth = startNetWorth;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getWeekStartDate() {
        return weekStartDate;
    }

    public void setWeekStartDate(LocalDateTime weekStartDate) {
        this.weekStartDate = weekStartDate;
    }

    public BigDecimal getStartNetWorth() {
        return startNetWorth;
    }

    public void setStartNetWorth(BigDecimal startNetWorth) {
        this.startNetWorth = startNetWorth;
    }
}

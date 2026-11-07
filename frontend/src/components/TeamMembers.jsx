import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function TeamMembers({ allUsers = [] }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Team Members</h3>
        <span style={styles.countBadge}>{allUsers.length}</span>
      </div>

      <div style={styles.list}>
        {allUsers.map((member) => (
          <div key={member.id} style={styles.memberCard}>
            {/* Avatar with Green Online Dot */}
            <div style={styles.avatarWrapper}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarFallback}>{getInitials(member.name)}</div>
              )}
              <span style={styles.onlineDot} />
            </div>

            {/* Name & Title */}
            <div style={styles.info}>
              <span style={styles.name}>{member.name}</span>
              <span style={styles.titleText}>{member.title || member.role}</span>
            </div>

            {/* Role indicator / Arrow */}
            <ChevronRight size={15} color="#cbd5e1" />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #edf0f7',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  title: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#191d31',
  },
  countBadge: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: '#f1f3f7',
    color: '#64748b',
    padding: '2px 8px',
    borderRadius: '99px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  memberCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 10px',
    borderRadius: '12px',
    transition: 'background 0.15s ease',
  },
  avatarWrapper: {
    position: 'relative',
    width: '36px',
    height: '36px',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#3157d5',
    color: '#ffffff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '12px',
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '9px',
    height: '9px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '2px solid #ffffff',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#191d31',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleText: {
    fontSize: '11px',
    color: '#787f95',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};


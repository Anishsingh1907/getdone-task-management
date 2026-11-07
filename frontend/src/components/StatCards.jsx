import React from 'react';
import { ArrowUpRight, CheckCircle2, UserCheck, ListPlus } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      id: 'done',
      title: 'Total project done',
      value: stats?.totalProjectDone || 322,
      growth: stats?.totalProjectDoneGrowth || '+0.4% More than last month',
      bg: '#eafaf1',
      accent: '#0d8a56',
      badgeBg: '#d1fae5',
      icon: CheckCircle2,
    },
    {
      id: 'clients',
      title: 'Client onboard',
      value: stats?.clientOnboard || 21,
      growth: stats?.clientOnboardGrowth || '+1.5% More than last week',
      bg: '#fff6ee',
      accent: '#d97706',
      badgeBg: '#ffedd5',
      icon: UserCheck,
    },
    {
      id: 'tasks',
      title: 'New task onboard',
      value: stats?.newTaskOnboard || 532,
      growth: stats?.newTaskOnboardGrowth || '+3.5% More than last week',
      bg: '#f5f2fe',
      accent: '#7c3aed',
      badgeBg: '#ede9fe',
      icon: ListPlus,
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.sectionTitle}>Project summery</h2>
      </div>
      <div style={styles.grid}>
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.id} style={{ ...styles.card, backgroundColor: c.bg }}>
              <div style={styles.cardTop}>
                <span style={styles.cardTitle}>{c.title}</span>
                <div style={{ ...styles.iconCircle, backgroundColor: c.badgeBg, color: c.accent }}>
                  <Icon size={16} />
                </div>
              </div>

              <div style={{ ...styles.cardValue, color: '#191d31' }}>{c.value}</div>

              <div style={styles.growthRow}>
                <div style={{ ...styles.growthBadge, backgroundColor: c.badgeBg, color: c.accent }}>
                  <ArrowUpRight size={13} />
                  <span>{c.growth}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '24px',
  },
  headerRow: {
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#191d31',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '135px',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
  },
  iconCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-1px',
    margin: '10px 0 6px 0',
  },
  growthRow: {
    display: 'flex',
    alignItems: 'center',
  },
  growthBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '99px',
  },
};


import { Shield, BookOpen, Eye, Heart } from 'lucide-react';
import styles from './AdvisorySection.module.css';

const ADVISORY_ROLES = [
  {
    id: 'clinical',
    title: 'Clinical Reviewer',
    description: 'Reviews content for psychological safety and trauma-informed practices',
    icon: Heart,
  },
  {
    id: 'research',
    title: 'Research Editor',
    description: 'Ensures content aligns with current evidence and research standards',
    icon: BookOpen,
  },
  {
    id: 'accessibility',
    title: 'Accessibility Reviewer',
    description: 'Evaluates content for inclusive design and cognitive accessibility',
    icon: Eye,
  },
  {
    id: 'safety',
    title: 'Safety Reviewer',
    description: 'Monitors content for crisis protocols and harm reduction',
    icon: Shield,
  },
];

export default function AdvisorySection({ advisors = [] }) {
  return (
    <section 
      className={styles.section} 
      aria-labelledby="advisory-heading"
      data-testid="section-advisory"
    >
      <div className={styles.container}>
        <h2 id="advisory-heading" className={styles.heading}>
          Advisory & Standards
        </h2>
        
        <p className={styles.statement}>
          We aim to be evidence-informed and review content over time.
        </p>

        <div className={styles.rolesGrid}>
          {ADVISORY_ROLES.map((role) => {
            const advisor = advisors.find((a) => a.role === role.id);
            const IconComponent = role.icon;
            
            return (
              <div 
                key={role.id} 
                className={styles.roleCard}
                data-testid={`card-advisory-${role.id}`}
              >
                <div className={styles.iconWrapper}>
                  <IconComponent 
                    className={styles.icon} 
                    aria-hidden="true" 
                    size={24} 
                  />
                </div>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleDescription}>{role.description}</p>
                
                {advisor?.name ? (
                  <p className={styles.advisorName} data-testid={`text-advisor-${role.id}`}>
                    {advisor.name}
                  </p>
                ) : (
                  <p className={styles.placeholder}>
                    Position open for future collaboration
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className={styles.note}>
          Advisory roles are listed to reflect our commitment to quality. 
          Names appear only when verified by the project owner.
        </p>
      </div>
    </section>
  );
}

import React from 'react';

export function PageHeader({
  eyebrow = 'SISTEM MONITORING KEHADIRAN',
  title,
  subtitle,
  actions,
  className = '',
}) {
  if (!title && !actions) return null;

  return (
    <div className={`page-heading flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${className}`}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="heading-actions flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export default PageHeader;


import './bootstrap.js';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import LayoutUtama from './Layouts/LayoutUtama.jsx';
import LayoutPublik from './Layouts/LayoutPublik.jsx';

const appName = import.meta.env.VITE_APP_NAME || 'HCGA Attendance';

// Persistent Layout Resolvers (Stable function references to prevent re-mounting / flickering)
const renderAdminLayout = (page) => <LayoutUtama>{page}</LayoutUtama>;
const renderUserLayout = (page) => <LayoutPublik>{page}</LayoutPublik>;

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    const page = await resolvePageComponent(`./Pages/${name}.jsx`, pages);

    // Otomatis pasang Persistent Layout jika halaman belum menentukan layout sendiri
    if (page.default.layout === undefined) {
      page.default.layout = name.startsWith('User/') ? renderUserLayout : renderAdminLayout;
    }

    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#c4a266',
    showSpinner: true,
  },
});

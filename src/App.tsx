/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './components/Overview';
import ProjectsModule from './components/ProjectsModule';
import ProjectDetails from './components/ProjectDetails';
import DeploymentsModule from './components/DeploymentsModule';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/projects" element={<ProjectsModule />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/deployments" element={<DeploymentsModule />} />
      </Routes>
    </Layout>
  );
}

import { createRoot } from 'react-dom/client';
import { WindowBar } from './comp/windowBar';
import './app.css';
import { Navigation } from './comp/navigation';

const root = createRoot(document.getElementById('root'));
root.render(
  <>
    <WindowBar></WindowBar>
    <Navigation></Navigation>
  </>
);
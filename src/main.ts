import {QueueAssistWindow} from './ui/queue_assist_window';
import {isUiAvailable} from './utils/environment';

const main = (): void => {
  if (!isUiAvailable || network.mode != 'none') {
    return;
  }
  ui.registerMenuItem('Queue Assist', () => openQueueAssistWindow());
};

function openQueueAssistWindow() {
  const window = new QueueAssistWindow();
  window.open();
}

export default main;

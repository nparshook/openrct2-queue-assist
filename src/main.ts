import {
  pluginName,
  pluginVersion
} from './environment';

const main = (): void => {
  console.log(`${pluginName}:${pluginVersion} has started.`);
};

export default main;

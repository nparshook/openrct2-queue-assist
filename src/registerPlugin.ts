/// <reference path="../lib/openrct2.d.ts" />
import {
  pluginName,
  pluginVersion,
} from './environment';
import main from './main';

registerPlugin({
  name: pluginName,
  version: pluginVersion,
  authors: ['nparshook'],
  type: 'local',
  licence: 'MIT',
  main,
});

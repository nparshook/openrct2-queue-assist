/// <reference path="../lib/openrct2.d.ts" />
import main from './main';
import {pluginName, pluginVersion,} from './utils/environment';

registerPlugin({
  name: pluginName,
  version: pluginVersion,
  authors: ['nparshook'],
  type: 'local',
  licence: 'MIT',
  main,
});

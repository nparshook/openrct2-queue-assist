/// <reference path="../../lib/openrct2.d.ts" />

export const getRides = (): Ride[] =>
    map.rides.filter((ride: Ride) => ride.classification == 'ride');
export const getRideNames = (rides: Ride[]): string[] =>
    rides.map((ride: Ride) => ride.name);

export const getPathSurfaces = (): LoadedObject[] =>
    context.getAllObjects('footpath_surface');
export const getPathRailings = (): LoadedObject[] =>
    context.getAllObjects('footpath_railings');
export const getObjectNames = (objects: LoadedObject[]): string[] =>
    objects.map((obj: LoadedObject) => obj.name);

import {QueueManager} from '../queue/queue_manager';
import {pluginName, pluginVersion} from '../utils/environment';
import {getObjectNames, getPathRailings, getPathSurfaces, getRideNames, getRides} from '../utils/helpers';

const windowId = 'queue.assist.main.window';
const windowTitle = `${pluginName} ${pluginVersion}`;
const windowWidth = 250;
const windowHeight = 200;

const largeWidgetWidth = windowWidth - 40;
const checkboxWidth = 10;
const widgetHeight = 20;

const rideSelectionId = 'queue.assist.ride.selection';
const rideCheckboxId = 'queue.assist.ride.checkbox';
const orpahnCheckboxId = 'queue.assist.orphan.checkbox';
const queueVisibilityToggleId = 'queue.assist.queue.visibility.toggle';

const surfaceSelectionId = 'queue.assist.queue.surface.selection';
const railingSelectionId = 'queue.assist.queue.railing.selection';
const queueStyleLabelId = 'queue.assist.queue.style.label';
const queueStyleApplyId = 'queue.assist.queue.style.apply';

function disable_style_editor(window: QueueAssistWindow, enabled: boolean) {
  window.queueStyleLabelWidget.isDisabled = enabled;
  window.queueStyleApplyWidget.isDisabled = enabled;
  window.surfaceSelectionWidget.isDisabled = enabled;
  window.railingSelectionWidget.isDisabled = enabled;
}

function select_ride_queue(window: QueueAssistWindow, ride_index: number) {
  if (ride_index < 0) {
    window.manager.unhighlight();
    disable_style_editor(window, true);
    window.surfaceSelectionWidget.selectedIndex = 0;
    window.railingSelectionWidget.selectedIndex = 0;
  } else {
    window.manager.toggle_ride_highlight(window.rides[ride_index].id);
    disable_style_editor(window, false);
    const current_surface = window.manager.currentSurface;
    const current_railings = window.manager.currentRailings;
    if (current_surface === null || current_railings === null) {
      return;
    }
    window.surfaceSelectionWidget.selectedIndex =
        window.surfaceIdToIdx[current_surface] + 1;
    window.railingSelectionWidget.selectedIndex =
        window.railingsIdToIdx[current_railings] + 1;
  }
}

function update_queue_style(window: QueueAssistWindow) {
  const surface_index = (window.surfaceSelectionWidget?.selectedIndex || 0) - 1;
  const railings_index =
      (window.railingSelectionWidget?.selectedIndex || 0) - 1;

  if (surface_index <= 0 || railings_index <= 0) {
    return;
  }

  window.manager.currentSurface = window.surfaceIdxToId[surface_index];
  window.manager.currentRailings = window.railingsIdxToId[railings_index];
}

function queue_style_dropdown_change(window: QueueAssistWindow, index: number) {
  index = index - 1;
  if (index < 0) {
    window.queueStyleApplyWidget.isDisabled = true;
    return;
  }
  window.queueStyleApplyWidget.isDisabled = false;
}

export class QueueAssistWindow {
  onReset: (() => void)|undefined;
  uiWindow: Window|null = null;
  rideDropdownHeadline = ['Select a ride'];
  surfaceDropdownHeadline = ['Select a surface style'];
  railingDropdownHeadline = ['Select a railing style'];
  manager: QueueManager;
  rides: Ride[];
  rideNames: string[];
  surfaces: LoadedObject[];
  railings: LoadedObject[];
  surfaceIdToIdx: Record<number, number>;
  surfaceIdxToId: Record<number, number>;
  railingsIdToIdx: Record<number, number>;
  railingsIdxToId: Record<number, number>;


  constructor() {
    this.manager = new QueueManager();
    this.rides = getRides();
    this.rideNames = getRideNames(this.rides);
    this.surfaces = getPathSurfaces();
    this.railings = getPathRailings();

    this.surfaceIdToIdx = {};
    this.surfaceIdxToId = {};
    this.surfaces.forEach((surface: LoadedObject, index: number) => {
      this.surfaceIdToIdx[surface.index] = index;
      this.surfaceIdxToId[index] = surface.index;
    });

    this.railingsIdToIdx = {};
    this.railingsIdxToId = {};
    this.railings.forEach((railings: LoadedObject, index: number) => {
      this.railingsIdToIdx[railings.index] = index;
      this.railingsIdxToId[index] = railings.index;
    });
  }

  get rideSelectionWidget(): DropdownWidget {
    return this.uiWindow?.findWidget(rideSelectionId) as DropdownWidget;
  }

  get rideCheckboxWidget(): CheckboxWidget {
    return this.uiWindow?.findWidget(rideCheckboxId) as CheckboxWidget;
  }

  get orphanCheckboxWidget(): CheckboxWidget {
    return this.uiWindow?.findWidget(orpahnCheckboxId) as CheckboxWidget;
  }

  get queueVisibilityToggle(): ButtonWidget {
    return this.uiWindow?.findWidget(queueVisibilityToggleId) as ButtonWidget;
  }

  get surfaceSelectionWidget(): DropdownWidget {
    return this.uiWindow?.findWidget(surfaceSelectionId) as DropdownWidget;
  }

  get railingSelectionWidget(): DropdownWidget {
    return this.uiWindow?.findWidget(railingSelectionId) as DropdownWidget;
  }

  get queueStyleLabelWidget(): LabelWidget {
    return this.uiWindow?.findWidget(queueStyleLabelId) as LabelWidget;
  }

  get queueStyleApplyWidget(): ButtonWidget {
    return this.uiWindow?.findWidget(queueStyleApplyId) as ButtonWidget;
  }

  set rideDropdownContent(content: string[]) {
    this.rideSelectionWidget.items = this.rideDropdownHeadline.concat(content);
  }

  set surfaceDropdownContent(content: string[]) {
    this.surfaceSelectionWidget.items =
        this.surfaceDropdownHeadline.concat(content);
  }

  set railingDropdownContent(content: string[]) {
    this.railingSelectionWidget.items =
        this.railingDropdownHeadline.concat(content);
  }

  open(): void {
    const self = this;
    const window = ui.getWindow(windowId);

    if (window) {
      console.log('The queue assist window is already shown.');
      window.bringToFront();
    } else {
      self.uiWindow = ui.openWindow({
        classification: windowId,
        width: windowWidth,
        height: windowHeight,
        title: windowTitle,
        onClose: () => self.manager.unhighlight(),
        widgets: [
          <CheckboxWidget>{
            name: rideCheckboxId,
            type: 'checkbox',
            isChecked: true,
            width: checkboxWidth,
            height: 20,
            x: 5,
            y: 20,
            onChange: () => {
              if (!self.rideCheckboxWidget.isChecked) {
                self.manager.unhighlight();
                self.queueVisibilityToggle.isDisabled = true;
                disable_style_editor(self, true);
                return;
              }
              self.queueVisibilityToggle.isDisabled = false;
              self.rideSelectionWidget.isDisabled = false;
              self.orphanCheckboxWidget.isChecked = false;
              disable_style_editor(self, false);
              const ride_index =
                  (self.rideSelectionWidget?.selectedIndex || 0) - 1;
              select_ride_queue(self, ride_index);
            }
          },
          <DropdownWidget>{
            name: rideSelectionId,
            type: 'dropdown',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 20,
            y: 20,
            items: self.rideDropdownHeadline,
            selectedIndex: 0,
            onChange: (ride_index: number) => {
              select_ride_queue(self, ride_index - 1);
            },
          },
          <CheckboxWidget>{
            name: orpahnCheckboxId,
            type: 'checkbox',
            text: 'Orphans',
            isChecked: false,
            width: checkboxWidth,
            height: widgetHeight,
            x: 5,
            y: 40,
            onChange: () => {
              if (!self.orphanCheckboxWidget.isChecked) {
                self.manager.unhighlight();
                self.queueVisibilityToggle.isDisabled = true;
                return;
              }
              self.queueVisibilityToggle.isDisabled = false;
              self.rideCheckboxWidget.isChecked = false;
              self.rideSelectionWidget.isDisabled = true;
              disable_style_editor(self, true);
              self.manager.highlight_orphans();
            }
          },
          <ButtonWidget>{
            name: queueVisibilityToggleId,
            type: 'button',
            text: 'Toggle Queue Visibility',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 20,
            y: 60,
            onClick: () => self.manager.toggle_visibility(),
          },
          <LabelWidget>{
            name: queueStyleLabelId,
            type: 'label',
            text: 'Queue Style Editor',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 5,
            y: 90,
          },
          <DropdownWidget>{
            name: surfaceSelectionId,
            type: 'dropdown',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 20,
            y: 110,
            items: self.surfaceDropdownHeadline,
            selectedIndex: 0,
            onChange: (index: number) => {
              queue_style_dropdown_change(self, index);
            }
          },
          <DropdownWidget>{
            name: railingSelectionId,
            type: 'dropdown',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 20,
            y: 140,
            items: self.railingDropdownHeadline,
            selectedIndex: 0,
            onChange: (index: number) => {
              queue_style_dropdown_change(self, index);
            }
          },
          <ButtonWidget>{
            name: queueStyleApplyId,
            type: 'button',
            text: 'Apply Queue Style',
            width: largeWidgetWidth,
            height: widgetHeight,
            x: 20,
            y: 170,
            onClick: () => {
              update_queue_style(self);
            }
          },
        ]
      });

      self.rideDropdownContent = self.rideNames;
      self.surfaceDropdownContent = getObjectNames(self.surfaces);
      self.railingDropdownContent = getObjectNames(self.railings);
      disable_style_editor(self, true);
    }
  }
}

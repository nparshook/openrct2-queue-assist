import {QueueManager} from '../queue/queue_manager';
import {pluginVersion} from '../utils/environment';
import {getObjectNames, getPathRailings, getPathSurfaces, getRideNames, getRides} from '../utils/helpers';

const windowId = 'queue.assist.main.window';
const windowTitle = `Queue Assist (v${pluginVersion})`;
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

export class QueueAssistWindow {
  private uiWindow: Window|null = null;
  private rideDropdownHeadline = ['Select a ride'];
  private surfaceDropdownHeadline = ['Select a surface style'];
  private railingDropdownHeadline = ['Select a railing style'];
  private manager: QueueManager;
  private rides: Ride[];
  private rideNames: string[];
  private surfaces: LoadedObject[];
  private railings: LoadedObject[];
  private surfaceIdToIdx: Record<number, number>;
  private surfaceIdxToId: Record<number, number>;
  private railingsIdToIdx: Record<number, number>;
  private railingsIdxToId: Record<number, number>;

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

  open(): void {
    const window = ui.getWindow(windowId);
    // If the window is already open let's close it first.
    // This refreshes the data.
    if (window) {
      window.close();
    }

    this.uiWindow = ui.openWindow(this.constructWindow());
    this.rideDropdownContent = this.rideNames;
    this.surfaceDropdownContent = getObjectNames(this.surfaces);
    this.railingDropdownContent = getObjectNames(this.railings);
    this.disable_style_editor(true);
  }

  private getWidgetById(widget_id: string): Widget {
    return this.uiWindow?.findWidget(widget_id) as Widget;
  }

  private get rideSelectionWidget(): DropdownWidget {
    return this.getWidgetById(rideSelectionId) as DropdownWidget;
  }

  private get rideCheckboxWidget(): CheckboxWidget {
    return this.getWidgetById(rideCheckboxId) as CheckboxWidget;
  }

  private get orphanCheckboxWidget(): CheckboxWidget {
    return this.getWidgetById(orpahnCheckboxId) as CheckboxWidget;
  }

  private get queueVisibilityToggle(): ButtonWidget {
    return this.getWidgetById(queueVisibilityToggleId) as ButtonWidget;
  }

  private get surfaceSelectionWidget(): DropdownWidget {
    return this.getWidgetById(surfaceSelectionId) as DropdownWidget;
  }

  private get railingSelectionWidget(): DropdownWidget {
    return this.getWidgetById(railingSelectionId) as DropdownWidget;
  }

  private get queueStyleLabelWidget(): LabelWidget {
    return this.getWidgetById(queueStyleLabelId) as LabelWidget;
  }

  private get queueStyleApplyWidget(): ButtonWidget {
    return this.getWidgetById(queueStyleApplyId) as ButtonWidget;
  }

  private setDropDownContent(
      widget: DropdownWidget, headline: string[], content: string[]) {
    widget.items = headline.concat(content);
  }

  private set rideDropdownContent(content: string[]) {
    this.setDropDownContent(
        this.rideSelectionWidget, this.rideDropdownHeadline, content);
  }

  private set surfaceDropdownContent(content: string[]) {
    this.setDropDownContent(
        this.surfaceSelectionWidget, this.surfaceDropdownHeadline, content);
  }

  private set railingDropdownContent(content: string[]) {
    this.setDropDownContent(
        this.railingSelectionWidget, this.railingDropdownHeadline, content);
  }

  private constructRideCheckbox() {
    return <CheckboxWidget>{
      name: rideCheckboxId,
      type: 'checkbox',
      isChecked: true,
      width: checkboxWidth,
      height: 20,
      x: 5,
      y: 20,
      onChange: () => this.ride_checkbox_change()
    };
  }

  private constructOrphanCheckbox() {
    return <CheckboxWidget>{
      name: orpahnCheckboxId,
      type: 'checkbox',
      text: 'Orphans',
      isChecked: false,
      width: checkboxWidth,
      height: widgetHeight,
      x: 5,
      y: 40,
      onChange: () => this.orphan_checkbox_change()
    };
  }

  private constructRideDropdown() {
    return <DropdownWidget>{
      name: rideSelectionId,
      type: 'dropdown',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 20,
      y: 20,
      items: this.rideDropdownHeadline,
      selectedIndex: 0,
      onChange: (ride_index: number) => this.select_ride_queue(ride_index - 1)
    };
  }

  private constructVisibilityToggle() {
    return <ButtonWidget>{
      name: queueVisibilityToggleId,
      type: 'button',
      text: 'Toggle Queue Visibility',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 20,
      y: 60,
      onClick: () => this.manager.toggle_visibility(),
    };
  }

  private constructStyleLabel() {
    return <LabelWidget>{
      name: queueStyleLabelId,
      type: 'label',
      text: 'Queue Style Editor',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 5,
      y: 90,
    };
  }

  private constructSurfaceDropdown() {
    return <DropdownWidget>{
      name: surfaceSelectionId,
      type: 'dropdown',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 20,
      y: 110,
      items: this.surfaceDropdownHeadline,
      selectedIndex: 0,
      onChange: (index: number) => this.queue_style_dropdown_change(index)
    };
  }

  private constructRailingsDropdown() {
    return <DropdownWidget>{
      name: railingSelectionId,
      type: 'dropdown',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 20,
      y: 140,
      items: this.railingDropdownHeadline,
      selectedIndex: 0,
      onChange: (index: number) => this.queue_style_dropdown_change(index)
    };
  }

  private constructStyleApplyBtn() {
    return <ButtonWidget>{
      name: queueStyleApplyId,
      type: 'button',
      text: 'Apply Queue Style',
      width: largeWidgetWidth,
      height: widgetHeight,
      x: 20,
      y: 170,
      onClick: () => this.update_queue_style()
    };
  }

  private constructWindow() {
    return <WindowDesc>{
      classification: windowId,
      width: windowWidth,
      height: windowHeight,
      title: windowTitle,
      onClose: () => this.manager.unhighlight(),
      widgets: [
        this.constructRideCheckbox(), this.constructRideDropdown(),
        this.constructOrphanCheckbox(), this.constructVisibilityToggle(),
        this.constructStyleLabel(), this.constructSurfaceDropdown(),
        this.constructRailingsDropdown(), this.constructStyleApplyBtn()
      ]
    };
  }

  private ride_checkbox_change() {
    if (!this.rideCheckboxWidget.isChecked) {
      this.manager.unhighlight();
      this.queueVisibilityToggle.isDisabled = true;
      this.disable_style_editor(true);
      return;
    }
    this.queueVisibilityToggle.isDisabled = false;
    this.rideSelectionWidget.isDisabled = false;
    this.orphanCheckboxWidget.isChecked = false;
    this.disable_style_editor(false);
    const ride_index = (this.rideSelectionWidget?.selectedIndex || 0) - 1;
    this.select_ride_queue(ride_index);
  }

  private orphan_checkbox_change() {
    if (!this.orphanCheckboxWidget.isChecked) {
      this.manager.unhighlight();
      this.queueVisibilityToggle.isDisabled = true;
      return;
    }
    this.queueVisibilityToggle.isDisabled = false;
    this.rideCheckboxWidget.isChecked = false;
    this.rideSelectionWidget.isDisabled = true;
    this.disable_style_editor(true);
    this.manager.highlight_orphans();
  }

  private disable_style_editor(enabled: boolean) {
    this.queueStyleLabelWidget.isDisabled = enabled;
    this.queueStyleApplyWidget.isDisabled = enabled;
    this.surfaceSelectionWidget.isDisabled = enabled;
    this.railingSelectionWidget.isDisabled = enabled;
  }

  private select_ride_queue(ride_index: number) {
    if (ride_index < 0) {
      this.manager.unhighlight();
      this.disable_style_editor(true);
      this.surfaceSelectionWidget.selectedIndex = 0;
      this.railingSelectionWidget.selectedIndex = 0;
    } else {
      this.manager.toggle_ride_highlight(this.rides[ride_index].id);
      this.disable_style_editor(false);
      const current_surface = this.manager.currentSurface;
      const current_railings = this.manager.currentRailings;
      if (current_surface === null || current_railings === null) {
        return;
      }
      this.surfaceSelectionWidget.selectedIndex =
          this.surfaceIdToIdx[current_surface] + 1;
      this.railingSelectionWidget.selectedIndex =
          this.railingsIdToIdx[current_railings] + 1;
    }
  }

  private queue_style_dropdown_change(index: number) {
    index = index - 1;
    if (index < 0) {
      this.queueStyleApplyWidget.isDisabled = true;
      return;
    }
    this.queueStyleApplyWidget.isDisabled = false;
  }

  private update_queue_style() {
    const surface_index = (this.surfaceSelectionWidget?.selectedIndex || 0) - 1;
    const railings_index =
        (this.railingSelectionWidget?.selectedIndex || 0) - 1;
    if (surface_index < 0 || railings_index < 0) {
      return;
    }

    this.manager.currentSurface = this.surfaceIdxToId[surface_index];
    this.manager.currentRailings = this.railingsIdxToId[railings_index];
  }
}

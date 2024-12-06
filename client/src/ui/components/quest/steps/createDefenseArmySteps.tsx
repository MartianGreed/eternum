import useUIStore from "@/hooks/store/useUIStore";
import { LeftView } from "@/ui/modules/navigation/LeftNavigationModule";
import { RightView } from "@/ui/modules/navigation/RightNavigationModule";
import { StepOptions } from "shepherd.js";
import { StepButton, waitForElement } from "./utils";

export const createDefenseArmySteps: StepOptions[] = [
  {
    title: "Realm Defense",
    text: "Your realm is always at risk. Assign it a defensive army for protection.",
    beforeShowPromise: function () {
      useUIStore.getState().setRightNavigationView(RightView.None);
      useUIStore.getState().setLeftNavigationView(LeftView.None);
      return new Promise<void>((resolve) => resolve());
    },
    buttons: [StepButton.next],
  },
  {
    title: "Claim",
    text: "A realm without defenses can be claimed by anyone instantly!",
    attachTo: {
      element: ".defensive-army-selector",
      on: "bottom",
    },
    classes: "mt-5",
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Construction",
    text: "Open the Construction menu.",
    attachTo: {
      element: ".construction-selector",
      on: "right",
    },
    classes: "ml-5 requires-interaction",
    advanceOn: {
      selector: ".construction-selector",
      event: "click",
    },
    buttons: [StepButton.prev],
  },
  {
    title: "Military Buildings",
    text: "Open the Military tab",
    attachTo: {
      element: ".military-tab-selector",
      on: "right",
    },
    classes: "ml-5",
    modalOverlayOpeningPadding: 10,
    advanceOn: {
      selector: ".military-tab-selector",
      event: "click",
    },
    beforeShowPromise: function () {
      useUIStore.getState().closeAllPopups();
      return waitForElement(".military-tab-selector");
    },
    buttons: [
      {
        text: "Prev",
        action: function () {
          useUIStore.getState().setLeftNavigationView(LeftView.None);
          return this.back();
        },
      },
    ],
  },
  {
    title: "Buildings",
    text: "You are limited to three movable armies and one protecting army, stationed on your Realm.",
    attachTo: {
      element: ".construction-panel-selector",
      on: "bottom",
    },
    classes: "mt-5",
    canClickTarget: false,
    beforeShowPromise: function () {
      return waitForElement(".construction-panel-selector");
    },
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Buildings",
    text: "Each military building you construct increases your max movable armies by +1, up to +3.",
    attachTo: {
      element: ".construction-panel-selector",
      on: "bottom",
    },
    classes: "mt-5",
    canClickTarget: false,
    beforeShowPromise: function () {
      return waitForElement(".construction-panel-selector");
    },
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Barracks",
    text: "Knights are well-rounded units, balanced in both offense and defense",
    attachTo: {
      element: ".barracks-card-selector",
      on: "bottom",
    },
    classes: "mt-5",
    canClickTarget: false,
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Archery Range",
    text: "Crossbowmen require less food on their travels and weight less.",
    attachTo: {
      element: ".archery-card-selector",
      on: "bottom",
    },
    classes: "mt-5",
    canClickTarget: false,
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Stables",
    text: "Paladins have increased stamina, allowing them to cover more ground at once.",
    attachTo: {
      element: ".stable-card-selector",
      on: "bottom",
    },
    classes: "mt-5",
    canClickTarget: false,
    buttons: [StepButton.prev, StepButton.next],
  },

  {
    title: "Military Menu",
    text: "Open the military menu",
    attachTo: {
      element: ".military-selector",
      on: "right",
    },
    classes: "ml-5",
    advanceOn: {
      selector: ".military-selector",
      event: "click",
    },
    buttons: [StepButton.prev],
  },
  {
    title: "Military",
    text: "Manage your armies here.",
    attachTo: {
      element: ".military-panel-selector",
      on: "right",
    },
    canClickTarget: false,
    classes: "ml-5",
    beforeShowPromise: function () {
      return waitForElement(".military-panel-selector");
    },

    buttons: [
      {
        text: "Prev",
        action: function () {
          useUIStore.getState().setLeftNavigationView(LeftView.None);
          return this.back();
        },
      },
      StepButton.next,
    ],
  },
  {
    title: "Create Defense Army",
    text: "Click here",
    attachTo: {
      element: ".defense-army-selector",
      on: "top",
    },
    classes: "-mt-5",
    advanceOn: {
      selector: ".defense-army-selector",
      event: "click",
    },
    showOn: () => {
      const showStep = document.querySelector(".defensive-army-selector");
      return !Boolean(showStep);
    },
    buttons: [StepButton.next],
  },

  {
    title: "Army Managemenet",
    text: "Monitor your army's stamina and inventory.",
    attachTo: {
      element: ".defensive-army-selector",
      on: "bottom",
    },
    canClickTarget: false,
    beforeShowPromise: function () {
      return waitForElement(".defensive-army-selector");
    },

    classes: "mt-5",
    buttons: [StepButton.prev, StepButton.next],
  },
  {
    title: "Edit",
    text: "Click the edit icon.",
    attachTo: {
      element: ".defensive-army-edit-selector",
      on: "top",
    },
    classes: "-mt-5",
    beforeShowPromise: function () {
      return waitForElement(".defensive-army-edit-selector");
    },
    advanceOn: {
      selector: ".defensive-army-edit-selector",
      event: "click",
    },
    buttons: [StepButton.prev],
  },
  {
    title: "Assign Troops",
    text: "Assign troops to your defensive army.",
    attachTo: {
      element: ".defensive-army-selector",
      on: "top",
    },
    classes: "-mt-5",
    beforeShowPromise: function () {
      return waitForElement(".defensive-army-selector");
    },
    buttons: [StepButton.prev, StepButton.finish],
  },
];
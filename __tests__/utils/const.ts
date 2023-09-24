const PORT = 3000;
export const BASE_URL = !process.env.RUN_IN_DOCKER
  ? `http://localhost:${PORT}`
  : `http://host.docker.internal:${PORT}`;

const testUser = "@testing";
const codeCellDoc = "9c93ccb1-6154-4a05-a6c8-903d092d2956"
const codeEditorId = "editor-f6000bef-8b13-4460-8eac-86644805ad88"

export const URL_CODE_CELL = `${BASE_URL}/${testUser}/${codeCellDoc}`;

// Constants for selecting components in CodeCell.tsx
export const CODE_CELL_SELECTOR = "[data-test='codeCell']";
export const CODE_TOOLBAR_SELECTOR = "[data-test='codeToolbar']";
export const CODE_CELL_EDITOR_SELECTOR = `[data-test='codeEditor'][data-testid='${codeEditorId}']`;
export const CODE_CELL_PROCESSING_SELECTOR = "[data-test='processing']";
export const CODE_CELL_OUTPUT_SELECTOR = "[data-test='output']";
export const CODE_CELL_STACK_SELECTOR = "[data-test='codeCell-stack']";
export const CODE_CELL_BADGE_SELECTOR = "[data-test='codeCell-badge']";
export const CODE_TOOLBAR_COMPONENT_SELECTOR = "[data-test='codeToolbar-component']";
export const CODE_CELL_OUTPUT_BOX_SELECTOR = "[data-test='codeCell-outputBox']";

// Constants for selecting components in CodeToolbar.tsx
export const CODE_TOOLBAR_CONTAINER_SELECTOR = "[data-test='codeToolbarContainer']";
export const TOOLBAR_STACK_SELECTOR = "[data-test='toolbarStack']";
export const LANGUAGE_SELECTOR = "[data-test='languageSelector']";
export const LANGUAGE_OPTION_JS_SELECTOR = "[data-test='languageOption-js']";
export const LANGUAGE_OPTION_GO_SELECTOR = "[data-test='languageOption-go']";
export const RUN_CODE_BUTTON_SELECTOR = "[data-test='runCodeButton']";
export const REMOVE_CELL_BUTTON_SELECTOR = "[data-test='removeCellButton']";
export const LOADING_INDICATOR_SELECTOR = "[data-test='loadingIndicator']";



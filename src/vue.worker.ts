import type { ProjectContext } from "@volar/language-service";

import { createNpmFileSystem } from "@volar/jsdelivr";
import { createTypeScriptWorkerLanguageService } from "@volar/monaco/worker";
import {
  createVueLanguagePlugin,
  getFullLanguageServicePlugins,
  resolveVueCompilerOptions,
} from "@vue/language-service";
import { initialize } from "monaco-editor/esm/vs/editor/editor.worker";
import * as typescript from "typescript";
import { URI } from "vscode-uri";
import { version } from "vue";

const allowImportingTsExtensions = true;
const allowJs = true;
const checkJs = true;
const asFileName = ({ path }: { path: string }) => path;
const asUri = (fileName: string) => URI.file(fileName);
const vueCompilerOptions = (() => {
  const target = Number(version.split(".").slice(0, -1).join("."));
  return resolveVueCompilerOptions({ target });
})();
const setup = ({ project }: { project: ProjectContext }) => {
  const compilerOptions = vueCompilerOptions;
  const value = { compilerOptions };
  Reflect.defineProperty(project, "vue", { value });
};
const compilerOptions = (() => {
  const {
    getDefaultCompilerOptions,
    JsxEmit: { Preserve: jsx },
    ModuleKind: { ESNext: module },
    ModuleResolutionKind: { Bundler: moduleResolution },
    ScriptTarget: { ESNext: target },
  } = typescript;
  return {
    ...getDefaultCompilerOptions(),
    allowImportingTsExtensions,
    allowJs,
    checkJs,
    jsx,
    module,
    moduleResolution,
    target,
  };
})();
const fs = createNpmFileSystem();
const workspaceFolders = [URI.file("/")];
const env = { fs, workspaceFolders };
const uriConverter = { asFileName, asUri };
const languageServicePlugins = getFullLanguageServicePlugins(typescript);
const languagePlugins = [
  createVueLanguagePlugin(
    typescript,
    compilerOptions,
    vueCompilerOptions,
    asFileName
  ),
];
self.onmessage = () => {
  initialize((workerContext) =>
    createTypeScriptWorkerLanguageService({
      compilerOptions,
      env,
      languagePlugins,
      languageServicePlugins,
      setup,
      typescript,
      uriConverter,
      workerContext,
    })
  );
};

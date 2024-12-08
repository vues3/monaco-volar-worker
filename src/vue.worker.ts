import type {
  LanguageServiceEnvironment,
  ProjectContext,
} from "@volar/language-service";

import { createNpmFileSystem } from "@volar/jsdelivr";
import { createTypeScriptWorkerLanguageService } from "@volar/monaco/worker";
import {
  createVueLanguagePlugin,
  getFullLanguageServicePlugins,
  resolveVueCompilerOptions,
} from "@vue/language-service";
import { initialize } from "monaco-editor-core/esm/vs/editor/editor.worker";
import * as typescript from "typescript";
import { URI } from "vscode-uri";
import { version } from "vue";

const vueCompilerOptions = (() => {
  const target = Number(version.split(".").slice(0, -1).join("."));
  return resolveVueCompilerOptions({ target });
})();
const setup = ({ project }: { project: ProjectContext }) => {
  const compilerOptions = vueCompilerOptions;
  const value = { compilerOptions };
  Reflect.defineProperty(project, "vue", { value });
};
const { options: compilerOptions } = (() => {
  const allowJs = true;
  const checkJs = true;
  const jsx = "Preserve";
  const target = "ESNext";
  const module = "ESNext";
  const moduleResolution = "Bundler";
  const allowImportingTsExtensions = true;
  return typescript.convertCompilerOptionsFromJson(
    {
      allowJs,
      checkJs,
      jsx,
      target,
      module,
      moduleResolution,
      allowImportingTsExtensions,
    },
    "",
  );
})();
const env = (() => {
  const fs = createNpmFileSystem();
  const workspaceFolders = [URI.file("/")];
  return { fs, workspaceFolders } as LanguageServiceEnvironment;
})();
const asFileName = ({ path }: { path: string }) => path;
const languagePlugins = [
  createVueLanguagePlugin(
    typescript,
    compilerOptions,
    vueCompilerOptions,
    asFileName,
  ),
];
const languageServicePlugins = getFullLanguageServicePlugins(typescript);
const uriConverter = (() => {
  const asUri = (fileName: string) => URI.file(fileName);
  return { asFileName, asUri };
})();
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
    }),
  );
};

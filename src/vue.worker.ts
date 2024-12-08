import type {
  LanguageServiceEnvironment,
  LanguagePlugin,
  FileSystem,
  LanguageServicePlugin,
} from "@volar/language-service";
import { CompilerOptions } from "typescript";
import type { VueCompilerOptions } from "@vue/language-core";

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

const asFileName = ({ path }: { path: string }) => path;
const asUri = (fileName: string) => URI.file(fileName);
const allowImportingTsExtensions: boolean = true;
const allowJs: boolean = true;
const checkJs: boolean = true;
const target: number = Number(version.split(".").slice(0, -1).join("."));
const vueCompilerOptions: VueCompilerOptions = resolveVueCompilerOptions({
  target,
});
const compilerOptions: CompilerOptions = {
  ...typescript.getDefaultCompilerOptions(),
  allowImportingTsExtensions,
  allowJs,
  checkJs,
  jsx: typescript.JsxEmit.Preserve,
  module: typescript.ModuleKind.ESNext,
  moduleResolution: typescript.ModuleResolutionKind.Bundler,
  target: typescript.ScriptTarget.ESNext,
};
const fs: FileSystem = createNpmFileSystem();
const workspaceFolders: URI[] = [URI.file("/")];
const env: LanguageServiceEnvironment = { fs, workspaceFolders };
const languageServicePlugins: LanguageServicePlugin[] =
  getFullLanguageServicePlugins(typescript);
const languagePlugins: LanguagePlugin[] = [
  createVueLanguagePlugin(
    typescript,
    compilerOptions,
    vueCompilerOptions,
    asFileName,
  ),
];
self.onmessage = () => {
  initialize((workerContext) =>
    createTypeScriptWorkerLanguageService({
      compilerOptions,
      env,
      languagePlugins,
      languageServicePlugins,
      setup: ({ project }) => {
        Reflect.defineProperty(project, "vue", {
          value: { compilerOptions: vueCompilerOptions },
        });
      },
      typescript,
      uriConverter: { asFileName, asUri },
      workerContext,
    }),
  );
};

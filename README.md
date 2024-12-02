# monaco-volar-worker

A worker for the integration of the language capabilities implemented based on Volar.js to Monaco Editor

## Installation

Install monaco-volar-worker with npm

```bash
  npm install @vues3/monaco-volar-worker
```

## Usage

### main.ts

```ts
import type { WorkerLanguageService } from "@volar/monaco/worker";

import {
  activateAutoInsertion,
  activateMarkers,
  registerProviders,
} from "@volar/monaco";
import VueWorker from "@vues3/monaco-volar-worker/dist/vue.worker?worker";
import * as languageConfigs from "@vues3/monaco-volar-worker/src/language-configs";
import { editor, languages } from "monaco-editor-core";
import EditorWorker from "monaco-editor-core/esm/vs/editor/editor.worker?worker";

...

const getWorker = (workerId: string, label: string) =>
  label === "vue" ? new VueWorker() : new EditorWorker();
window.MonacoEnvironment = { getWorker };
const languageId = ["vue", "javascript", "typescript", "css"];
["vue", "js", "ts", "css"].forEach((value, index) => {
  const id = languageId[index];
  const extensions = [`.${value}`];
  languages.register({ extensions, id });
  languages.setLanguageConfiguration(
    id,
    languageConfigs[
      value as keyof typeof languageConfigs
    ]
  );
});
const [label] = languageId;
const moduleId = "vs/language/vue/vueWorker";
const getSyncUris = () => editor.getModels().map(({ uri }) => uri);
const worker = editor.createWebWorker<WorkerLanguageService>({
  label,
  moduleId,
});
activateMarkers(worker, languageId, label, getSyncUris, editor);
activateAutoInsertion(worker, languageId, getSyncUris, editor);
await registerProviders(worker, languageId, getSyncUris, languages);

...

```

### monaco.vue

```vue
<template>
  <div style="width: 100%; height: 100%;" ref="monaco"></div>
</template>
<script setup lang="ts">
import type { Ref } from "vue";

import { registerHighlighter } from "@vues3/monaco-volar-worker/src/highlight";
import { getOrCreateModel } from "@vues3/monaco-volar-worker/src/utils";
import { editor, Uri } from "monaco-editor-core";
import { onBeforeUnmount, onMounted, ref } from "vue";

const sfc = ref("<template></template>");
const ambiguousCharacters = false;
const automaticLayout = true;
const fixedOverflowWidgets = true;
const scrollBeyondLastLine = false;
const monaco: Ref<HTMLElement | undefined> = ref();
let editorInstance: editor.IStandaloneCodeEditor | undefined;
const unicodeHighlight = { ambiguousCharacters };
const { light: theme } = registerHighlighter();
const model = getOrCreateModel(
  Uri.parse("file:///monaco.vue"),
  "vue",
  sfc.value
);
onMounted(() => {
  if (monaco.value) {
    editorInstance = editor.create(monaco.value, {
      automaticLayout,
      fixedOverflowWidgets,
      model,
      scrollBeyondLastLine,
      theme,
      unicodeHighlight,
    });
    editorInstance.onDidChangeModelContent(() => {
      sfc.value = editorInstance?.getValue();
    });
    editorInstance.focus();
  }
});
onBeforeUnmount(() => {
  editorInstance?.dispose();
});
</script>
```

## Related

Here are some related projects

[Monaco-Volar](https://github.com/Kingwl/monaco-volar)

[Vue SFC REPL](https://github.com/vuejs/repl)

## License

[MIT](https://choosealicense.com/licenses/mit/)

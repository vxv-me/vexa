# vexa
Vexa - backend driven frontend platform

В качестве пакетного менеджера используется [yarn](https://yarnpkg.com/)
Для упрещенной работы с зависимостями используется [lerna](https://lerna.js.org/) + [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).


## Начало работы
Для начала работы, необходимо установить зависимсоти.
```
yarn run bootstrap
```


### Ошибки установки:
В момент установки зависимостей, есть warning ошибки у пакета **@vexa/ui-kit** изза **storybook**. (Решение - дождаться стабильной версии, либо перейти на styleguide)
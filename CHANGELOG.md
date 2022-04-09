# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add testing for Tailwind

### Changed
- **Breaking:** Replace `configureColors` function with `tailwindColors` function that only takes a Color Suite config object and returns the tailwind equivalent. It moves the require of the `colors.config.js` file into the tailwind config file
  - This approach allows Tailwind to track the `colors.config.js` file as a dependency with its JIT engine which means no more full page refresh when making CRUD changes to the color palette 🎉
- Made package dependency-free by establishing proper peer dependencies and bundling all application dependencies into the build
- Target a minimum version of Tailwind CSS v3

### Fixed
- Prevent error when updating root variables after hot update by maintaining our own stylesheet

## [0.3.1] - 2021-10-12

### Added
- Add setting for adding CSS `inherit` value to palette

### Changed
- Patch root variables directly using stylesheet rather than polluting the HTML element

### Fixed
- Don't join current working directory to config path if the passed config path is absolute.

## [0.3.0] - 2021-09-16

Initial public release! Third refactor.

### Vite Plugin
#### Added
- Add Vite plugin for scaffolding Color Suite around a given project
- Add color palette CRUD endpoints to Vite dev server for updating `colors.config.js`
- Add settings update endpoint to Vite dev server for updating `colors.config.js`

### Tailwind Configurator
#### Added
- Add color configuration function to configure Tailwind CSS using Color Suite's `color.config.js`
### Editor Application

#### Services

##### Added
- Add keyboard service for handling keyboard input
- Add settings service that is responsible for managing the state of the settings config
- Add color service that is responsible for managing the state of the color palette

#### Components

##### Added
- Add `SvgIcon` component for displaying icons from the SVG sprite

- Add `AbstractButton` component as a base for other button-like components
- Add `ButtonTab`, `ButtonGhost`, `ButtonNeutral`, `ButtonBlue`, and `ButtonRed`, button components

- Add `FormField` component to wrap common elements around form inputs
- Add `TextInput` component for styling text input
- Add `Toggle` component for styling a checkbox to look like a toggle switch
- Add `Slider` and `SliderXy` input components for getting one or two values between a fixed range
- Add `ColorPicker` component for choosing a single color with visual HSVA picker and inputs for Hex, Alpha, RGB, and HSV
- Add `ColorSelect` component for selecting a color token from your color palette

- Add `ColorSingleEditor` component for creating and editing single Color Suite colors
- Add `ColorScaleEditor` component for creating and editing Color Suite color scales using component curves through HSV space
- Add `ColorAliasEditor` component for creating and editing Color Suite aliases which target existing colors in your color palette
- Add `SettingsEditor` component for updating Color Suite settings

- Add `ColorPaletteItem` component for the colors view to display any color from your color palette

#### Routes

##### Added
- Add main color palette view to manage colors
- Add color create view that displays a corresponding editor component for the color type being created
- Add color edit view that displays a corresponding editor component for the color type being edited
- Add settings view to edit settings related to the panel and your palette

### CLI

#### Added
- Add `tailwindcss-color-suite export` command to convert Color Suite's `color.config.js` to a Tailwind CSS compatible color object and save it in the project root as `tailwindcss.colors.config.js`

### Development

#### Added
- Add development version of the Vite plugin to scaffold the editor for development

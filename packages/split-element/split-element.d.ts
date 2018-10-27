/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { LitElement } from '@polymer/lit-element';
export * from '@polymer/lit-element';
export interface SplitElementConstructor {
    new (): SplitElement;
    load(): Promise<typeof SplitElement>;
    _resolveLoaded(): void;
    _rejectLoaded(e: Error): void;
}
export declare class SplitElement extends LitElement {
    /**
     * Abstract: Implement in a stub class to load the implementation.
     */
    static load: () => Promise<typeof SplitElement>;
    static _resolveLoaded: () => void;
    static _rejectLoaded: (e: Error) => void;
    static _loadedPromise?: Promise<void>;
    private static implClass?;
    static loaded(): Promise<void> | undefined;
    private static _upgrade;
    private static _upgradingElement;
    constructor();
    render(): import("lit-html/lib/template-result").TemplateResult;
}

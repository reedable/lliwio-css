# classes

Provides CSS rules scoped to elements identified by classes.

Nesting rules under a class selector has long served as "poor-man's scoping."
Whether written as `.my-component h2` or as `h2` nested inside `.my-component`,
the selector restricts the rule to headings within that component. However,
when competing declarations otherwise tie in the cascade, source order decides
which rule wins, regardless of how close each component is to the heading.
For example:

```css
.my-component {
  h2 { font-size: 20px; }
}

.someone-else {
  h2 { font-size: 24px; }
}
```

```html
<div class="someone-else">
  <div class="my-component">
    <h2>Hello, world!</h2>
  </div>
</div>
```

In this example, the selectors have equal specificity, so the later rule wins.
The `<h2>` has a font size of `24px`, even though `.my-component` is its closer
ancestor. To make the component's own style win, we might resort to increasing
specificity or using `!important`, both of which can lead to long-term
maintainability issues.

The `@scope` at-rule provides specification-supported scoping. It introduces
scope proximity as a tie-breaker after specificity and before source order:

```css
@scope (.my-component) {
  :scope {
    h2 { font-size: 20px; }
  }
}

@scope (.someone-else) {
  :scope {
    h2 { font-size: 24px; }
  }
}
```

```html
<div class="someone-else">
  <div class="my-component">
    <h2>Hello, world!</h2>
  </div>
</div>
```

In this second example, the competing selectors again have equal specificity.
The `.my-component` scoping root is closer to the `<h2>`, so its `20px` rule
wins even though the `.someone-else` rule appears later. Scope proximity does
not override higher specificity or earlier cascade criteria, such as importance
and layer precedence. See the [cascade sorting order](https://drafts.csswg.org/css-cascade-6/#cascade-sort).

**Compatibility note:** The current CSS Cascading and Inheritance Level 6
editor's draft allows declarations directly inside `@scope`. These declarations
target the scoping root with zero specificity, equivalent to wrapping them in
`:where(:scope)`. See [scoped declarations](https://drafts.csswg.org/css-cascade-6/#scoped-declarations).

lliwio-css uses explicit `:scope` rules for compatibility with tools such as
Lightning CSS 1.32.0, which rejects bare declarations inside `@scope`. The
`:scope` pseudo-class contributes specificity, so this explicit form is not
identical in specificity to bare scoped declarations.

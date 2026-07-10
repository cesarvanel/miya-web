# Tokens Miya — source de vérité

Extraits de `design/Miya Web - Spec.dc.html` (export Claude Design). Rien n'est inventé :
chaque valeur de `tokens.json` provient des styles inline des maquettes (les champs `usage`
citent le contexte d'origine).

## Flux

```
design/Miya Web - Spec.dc.html  →  design/tokens/tokens.json  →  libs/ui/src/styles/theme.css (@theme Tailwind v4)
```

Le preset Tailwind partagé est `libs/ui/src/styles/theme.css`. Les apps l'importent dans
leur `styles.css` :

```css
@import 'tailwindcss';
@import '../../../libs/ui/src/styles/theme.css';
```

## Choix documentés (seuls mappings non littéraux)

- **StatusBadge** : `collected` (Collecté/Cotisé/Validé), `pending` (En attente) et
  `absent` sont relevés tels quels dans les maquettes. `disputed` reprend le rouge de
  l'UI contestations (#C43B32/#FBEBE9), `rejected` le rouge plein (chips « Traiter »,
  « NOUVEAU » : blanc sur #C43B32), `postponed` le bleu des badges « Validé ✓ »
  (#2A6BA8/#E1EDF9) — la maquette agrège « Absent/Reporté » en gris.
- **Polices** : les maquettes chargent Plus Jakarta Sans + Space Grotesk via Google Fonts ;
  on self-hoste via `@fontsource-variable/*`. La classe `.num` des maquettes
  (Space Grotesk + `tabular-nums`) devient `font-num tabular-nums` côté Tailwind.

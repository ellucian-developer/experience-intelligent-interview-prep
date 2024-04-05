// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

const colors = [ 'fountain', 'iris', 'kiwi', 'meadow', 'purple', 'saffron', 'tangerine' ];

export function randomPathColorName(contextParameter) {
    const context = contextParameter || { colorsUsed: [] };
    context.colorsUsed = context.colorsUsed || [];
    let { colorsUsed } = context;

    let availableColors = colors.filter( c => !colorsUsed.includes(c));

    if (availableColors.length === 0) {
        // reset
        availableColors = colors;
        colorsUsed = [];
        context.colorsUsed = colorsUsed;
    }

    const colorIndex = Math.floor(Math.random() * availableColors.length);
    const color = availableColors[colorIndex];
    context.colorsUsed.push(color);

    return color;
}
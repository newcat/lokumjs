export function RenderProperty(target: any, propertyKey: string) {
    if (!target._reactiveProps) { target._reactiveProps = []; }
    target._reactiveProps.push(propertyKey);
}

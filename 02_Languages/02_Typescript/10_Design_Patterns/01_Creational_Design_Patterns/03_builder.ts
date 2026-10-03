interface Builder {
    setPartA(): void
    setPartB(): void
    setPartC(): void
}

class Product {
    private parts: string[] = []

    public add(part: string): void {
        this.parts.push(part)
    }

    public listParts(): void {
        console.log(`Product parts : ${this.parts.join('_-_')}`)
    }
}

class ConcreteBuilder implements Builder {
    private product!: Product;
    
    public setPartA(): void {

    }

    public setPartB(): void {

    }

    public setPartC(): void {

    }
}

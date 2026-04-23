import { describe, expect, test } from 'vitest'
import Cart from './Cart'

describe(
    Counter, () => {
        test("first test", () => {
            const { getAllByTestId } = render(<Cart />)
            const val = getAllByTestId('tot').textContent;
            expect(val).toBe(0)
        })
    }
)
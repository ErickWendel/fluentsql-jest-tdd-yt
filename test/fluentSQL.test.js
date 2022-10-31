import { expect, describe, test } from '@jest/globals';
import of from '../src/fluentSQL';

const data = [
    {
        id: 0,
        name: 'erickwendel',
        category: 'developer'
    },
    {
        id: 1,
        name: 'mariazinha',
        category: 'developer'
    },
    {
        id: 2,
        name: 'joaozin',
        category: 'manager'
    }
];

describe('Test Suite for FluentSQL Builder', () => {
    test('#build should return the empty object instance', () => {
        const result = of(data).build();
        const expected = data;
        expect(result).toStrictEqual(expected);
    });

    test('#limit given a colletion it should limit results', () => {
        const result = of(data).limit(1).build();
        const expected = [data[0]];

        expect(result).toStrictEqual(expected);
    });

    test('#where given a collection it should filter data', () => {
        const result = of(data)
            .where({
                category: /^dev/
            })
            .build();

        const expected = data.filter(
            ({ category }) => category.slice(0, 3) === 'dev'
        );

        expect(result).toStrictEqual(expected);
    });

    test('#select given a collection it should return only specifc fields', () => {
        const result = of(data).select(['name', 'category']).build();

        const expected = data.map(({ name, category }) => ({ name, category }));

        expect(result).toStrictEqual(expected);
    });

    test('#orderBy given a collection it should order results by field', () => {
        const result = of(data).orderBy('name').build();

        const expected = [
            {
                id: 0,
                name: 'erickwendel',
                category: 'developer'
            },
            {
                id: 2,
                name: 'joaozin',
                category: 'manager'
            },
            {
                id: 1,
                name: 'mariazinha',
                category: 'developer'
            }
        ];

        expect(result).toStrictEqual(expected);
    });

    test('#groupBy given a collection it should group results by field', () => {
        const result = of(data).groupBy('category').build();

        const expected = {
            developer: [
                {
                    id: 0,
                    name: 'erickwendel',
                    category: 'developer'
                },

                {
                    id: 1,
                    name: 'mariazinha',
                    category: 'developer'
                }
            ],
            manager: [
                {
                    id: 2,
                    name: 'joaozin',
                    category: 'manager'
                }
            ]
        };

        expect(result).toStrictEqual(expected);
    });

    test('pipeline', () => {
        const result = of(data)
            .where({ category: 'developer' })
            .where({ name: /m/ })
            .select(['name', 'category'])
            .orderBy('name')

            .build();

        const expected = data
            .filter(({ id }) => id === 1)
            .map(({ name, category }) => ({ name, category }));
        expect(result).toStrictEqual(expected);
    });

    test('pipeline width groupBy', () => {
        const result = of(data)
            .where({ category: 'developer' })
            .where({ name: /m/ })
            .select(['name', 'category'])
            .orderBy('name')
            .groupBy('category')

            .build();

        const expected = {
            developer: [{ category: 'developer', name: 'mariazinha' }]
        };

        expect(result).toStrictEqual(expected);
    });
});

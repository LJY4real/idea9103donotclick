# Quiz 8 - Major Assignment Design Research

## Part 1: Imaging Technique Inspiration

### Inspiration Sources

My imaging technique inspiration comes from three iconic works:

**Salvador Dalí - The Persistence of Memory (1931)**

![The Persistence of Memory](https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg)

**The Matrix (1999) - Digital Rain Effect**

![Matrix Digital Rain](https://wallpaperaccess.com/full/9182082.jpg)

**Piet Mondrian - Composition with Red, Yellow and Blue (1930)**

![Mondrian Composition](https://www.piet-mondrian.org/images/paintings/composition-with-red-yellow-and-blue.jpg)

### What I Want to Incorporate

I'm inspired by three artistic approaches to **reality, structure, and transformation**:

**Dalí's melting clocks** show that time is fluid and subjective, not rigid. **The Matrix** shows how reality can be manipulated through code and digital effects. **Mondrian's geometric abstraction** demonstrates how complex reality can be reduced to pure color and form.

For my project, I want to create an interactive clock that combines these concepts. The clock face features Mondrian-style geometric color blocks (red, yellow, blue, white) with black grid lines, representing the underlying structure of reality. The clock hands spin with RGB rainbow colors, accelerating over time while generating chaotic visual patterns. After 10 seconds, everything gradually fades to reveal a transformed reality - like breaking through the matrix or waking from a surreal dream.

This technique creates a narrative: **geometric order → accelerating chaos → transformation**. It explores themes of time, perception, abstract structure, and digital reality through the fusion of three iconic art movements.

---

## Part 2: Coding Technique Exploration

### The Coding Technique

**Object-Oriented Programming with Dynamic Arrays and Time Control**

Key elements:
- Custom classes to manage visual elements
- Arrays to store and iterate through objects
- Time-based triggers with `millis()` function
- Mathematical transformations for rotation

### How It Helps

This technique allows me to:
- Build up visual complexity gradually (random shapes generated as clock accelerates)
- Create sudden transformation (clearing everything after 10 seconds)
- Give each shape independent properties (color, size, rotation, gradient)
- Achieve the chaotic yet structured aesthetic from both Dalí and The Matrix

The combination of loops, conditionals, and arrays creates the illusion of time accelerating and reality fragmenting, then resetting.

### Code Example

**Reference Implementation:**

[p5.js Objects Rotate](https://p5js.org/examples/transformation-rotate/)

**Key Techniques:**
- Classes and constructors
- Arrays with `push()` method
- `for...of` loops
- Time control with `millis()`
- Trigonometry (`cos`, `sin`)

---

## Summary

Interactive artwork merging three iconic art movements: Dalí's surrealist fluid time, The Matrix's digital reality manipulation, and Mondrian's geometric abstraction. The clock features random Mondrian-style color blocks with RGB rainbow hands that accelerate while spawning geometric shapes and Matrix-style green code rain. After 10 seconds, everything gradually fades over 20 seconds to reveal a new reality - a metaphor for transformation and awakening. Users can explore the final image with a magnifying glass, discovering hidden details in the transformed world.
// Visual C Programming Studio - Example C Program
// This file can be compiled with: gcc -Wall -O2 1.c -o program && ./program

#include <stdio.h>

int main() {
    // 1. Basic Variable & Output
    int age = 16;
    printf("Welcome to Visual C Programming Studio!\n");
    printf("User age: %d\n", age);

    // 2. Loop Demonstration
    printf("\nCounting to 5 with a for loop:\n");
    for (int i = 1; i <= 5; i++) {
        printf("  Step %d\n", i);
    }

    // 3. Pointer Demonstration
    int num = 42;
    int *ptr = &num; // ptr stores address of num
    printf("\nPointer demo: num = %d, stored at address %p\n", num, (void*)ptr);
    *ptr = 100; // mutate through pointer
    printf("After *ptr = 100, num is now %d\n", num);

    return 0;
}

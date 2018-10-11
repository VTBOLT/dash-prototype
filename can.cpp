#include <iostream>
#include <stdio.h>
#include <unistd.h>
int main(){
    int x = 0;
    while(x < 100){
        std::cout << x << std::endl;
        sleep(1);
        x++;
        if(x == 99){
            x = 0;
        }
    }
}
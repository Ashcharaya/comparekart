CC = gcc
CFLAGS = -Wall -Wextra -O2 -std=c99
TARGET = comparekart.exe
SRC = comparekart.c

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET)

clean:
	del /f $(TARGET)

test-recommend: $(TARGET)
	./$(TARGET) --recommend "Mobiles & Electronics Appliances" 30000

test-compare: $(TARGET)
	./$(TARGET) --compare 1,2 25000

run: $(TARGET)
	./$(TARGET)

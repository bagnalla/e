FILES = main.js
TARGET = ../dist/bundle.js

.PHONY: all clean

all: 
	browserify $(FILES) -o $(TARGET)

clean:
	rm -f $(TARGET)

CXX = clang++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -Iinclude

SRC_DIR = src
INC_DIR = include
OBJ_DIR = obj
BIN_DIR = bin

# Source files for the main application
SRCS = $(SRC_DIR)/utils/DateUtils.cpp \
       $(SRC_DIR)/utils/ConsoleUI.cpp \
       $(SRC_DIR)/utils/FileUtils.cpp \
       $(SRC_DIR)/models/Medicine.cpp \
       $(SRC_DIR)/models/Supplier.cpp \
       $(SRC_DIR)/models/Invoice.cpp \
       $(SRC_DIR)/services/InventoryManager.cpp \
       $(SRC_DIR)/services/SupplierManager.cpp \
       $(SRC_DIR)/services/SalesManager.cpp \
       $(SRC_DIR)/services/ReportGenerator.cpp

MAIN_SRC = $(SRC_DIR)/main.cpp

TEST_SRC = tests/test_medical_store.cpp

# Object files
OBJS = $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))
MAIN_OBJ = $(OBJ_DIR)/main.o
TEST_OBJ = $(OBJ_DIR)/test_medical_store.o

# Targets
APP_TARGET = $(BIN_DIR)/medstore
TEST_TARGET = $(BIN_DIR)/test_runner

.PHONY: all clean test help

all: $(APP_TARGET) $(TEST_TARGET)

# Link Main Executable
$(APP_TARGET): $(OBJS) $(MAIN_OBJ) | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) -o $@ $^
	@echo "[BUILD SUCCESS] Main executable created at $(APP_TARGET)"

# Link Test Executable
$(TEST_TARGET): $(OBJS) $(TEST_OBJ) | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) -o $@ $^
	@echo "[BUILD SUCCESS] Test runner executable created at $(TEST_TARGET)"

# Compile App Object Files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp | $(OBJ_DIR)
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Compile Main Object File
$(OBJ_DIR)/main.o: $(MAIN_SRC) | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Compile Test Object File
$(OBJ_DIR)/test_medical_store.o: $(TEST_SRC) | $(OBJ_DIR)
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Ensure Directories Exist
$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

test: $(TEST_TARGET)
	@echo "[TEST] Executing Unit Tests..."
	./$(TEST_TARGET)

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR) data/*.csv
	@echo "[CLEAN] Build artifacts and temporary data files cleaned."

help:
	@echo "Medical Store Management System Build Options:"
	@echo "  make         - Build both application and test runner"
	@echo "  make test    - Build and execute unit tests"
	@echo "  make clean   - Clean build artifacts"

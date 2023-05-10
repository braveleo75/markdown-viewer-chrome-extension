# Markdown syntax guide
## Headers
# This is a Heading h1
## This is a Heading h2
_You **can** combine them_
## Blocks of code
```cpp
enum class ERepType : uint8
{
	DynamicArray			= 0,	//! Dynamic array
	Return					= 1,	//! Return from array, or end of stream
	Property				= 2,	//! Generic property
};
```
# Blocks of PlantUML
```plantuml
@startuml
Bob -> Alice : hello
@enduml
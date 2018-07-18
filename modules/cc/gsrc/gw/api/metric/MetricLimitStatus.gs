package gw.api.metric

@ReadOnly
enum MetricLimitStatus {

  NONE("rating_empty.png"),
  INACTIVE("rating_gray.png"),
  GREEN("rating_green.png"),
  YELLOW("rating_yellow.png"),
  RED("rating_red.png")
  
  var _icon : String as readonly Icon
  
  private construct(inIcon : String) {
    _icon = inIcon
  }
}
